import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const addFareReport = async (userId, fareData) => {
  try {
    const docRef = await addDoc(collection(db, 'fareReports'), {
      userId,
      fromAreaId: fareData.fromAreaId,
      fromAreaName: fareData.fromAreaName,
      toAreaId: fareData.toAreaId,
      toAreaName: fareData.toAreaName,
      transportType: fareData.transportType,
      fare: fareData.fare,
      distance: fareData.distance,
      notes: fareData.notes || '',
      timestamp: Timestamp.now(),
      rating: fareData.rating || 5,
      verified: false,
      verifiedCount: 0,
      helpful: 0,
      unhelpful: 0,
      isActive: true
    });

    await updateDoc(doc(db, 'users', userId), {
      totalReports: increment(1)
    });

    return { success: true, reportId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFareReports = async (fromAreaId, toAreaId, transportType = null, pageSize = 50) => {
  try {
    const q = query(
      collection(db, 'fareReports'),
      where('fromAreaId', '==', fromAreaId),
      where('toAreaId', '==', toAreaId),
      where('isActive', '==', true),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    const reports = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!transportType || data.transportType === transportType) {
        reports.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
      }
    });

    return { success: true, reports };
  } catch (error) {
    return { success: false, error: error.message, reports: [] };
  }
};

export const getRecentReports = async (limit_count = 10) => {
  try {
    const q = query(
      collection(db, 'fareReports'),
      where('isActive', '==', true),
      orderBy('timestamp', 'desc'),
      limit(limit_count)
    );

    const querySnapshot = await getDocs(q);
    const reports = [];

    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      });
    });

    return { success: true, reports };
  } catch (error) {
    return { success: false, error: error.message, reports: [] };
  }
};

export const getUserReports = async (userId) => {
  try {
    const q = query(
      collection(db, 'fareReports'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const reports = [];

    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      });
    });

    return { success: true, reports };
  } catch (error) {
    return { success: false, error: error.message, reports: [] };
  }
};

export const updateFareReport = async (reportId, updates) => {
  try {
    await updateDoc(doc(db, 'fareReports', reportId), {
      ...updates,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markHelpful = async (reportId) => {
  try {
    await updateDoc(doc(db, 'fareReports', reportId), {
      helpful: increment(1)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markUnhelpful = async (reportId) => {
  try {
    await updateDoc(doc(db, 'fareReports', reportId), {
      unhelpful: increment(1)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteFareReport = async (reportId) => {
  try {
    await updateDoc(doc(db, 'fareReports', reportId), {
      isActive: false
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAverageFare = async (fromAreaId, toAreaId, transportType) => {
  try {
    const reportsResult = await getFareReports(fromAreaId, toAreaId, transportType, 100);

    if (!reportsResult.success || reportsResult.reports.length === 0) {
      return { success: false, error: 'No reports found' };
    }

    const reports = reportsResult.reports;
    const total = reports.reduce((sum, r) => sum + r.fare, 0);
    const average = Math.round(total / reports.length);

    return {
      success: true,
      average,
      min: Math.min(...reports.map(r => r.fare)),
      max: Math.max(...reports.map(r => r.fare)),
      count: reports.length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
