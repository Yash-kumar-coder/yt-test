import { db, collection, addDoc, getDocs, doc, getDoc, query, where, orderBy, setDoc, deleteDoc } from '../firebase';

// Helper to seed initial exam categories if empty
export const getExams = async () => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      console.warn("Firebase not configured, using mock data.");
      return [
        { id: '1', name: 'JEE Main', icon: '/jee.jpg' },
        { id: '2', name: 'NEET', icon: '/neet.jpg' },
        { id: '3', name: 'SSC', icon: '/ssc.jpg' },
        { id: '4', name: 'UPSC', icon: '/upsc.jpg' },
        { id: '5', name: 'Railway', icon: '/rrb.jpg' },
      ];
    }
    
    const examsCol = collection(db, 'exams');
    const examSnapshot = await getDocs(examsCol);
    
    if (examSnapshot.empty) {
      return [
        { id: '1', name: 'JEE Main', icon: '/jee.jpg' },
        { id: '2', name: 'NEET', icon: '/neet.jpg' },
        { id: '3', name: 'SSC', icon: '/ssc.jpg' },
        { id: '4', name: 'UPSC', icon: '/upsc.jpg' },
        { id: '5', name: 'Railway', icon: '/rrb.jpg' },
      ];
    }
    
    return examSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Error fetching exams, using mock data.", error);
    return [
      { id: '1', name: 'JEE Main', icon: '/jee.jpg' },
      { id: '2', name: 'NEET', icon: '/neet.jpg' },
      { id: '3', name: 'SSC', icon: '/ssc.jpg' },
      { id: '4', name: 'UPSC', icon: '/upsc.jpg' },
      { id: '5', name: 'Railway', icon: '/rrb.jpg' },
    ];
  }
};

export const getTestsByCategory = async (categoryName) => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      return [];
    }
    const q = query(collection(db, 'tests'), where("exam", "==", categoryName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tests:", error);
    return [];
  }
};

export const getAllTests = async () => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      return [];
    }
    const testsCol = collection(db, 'tests');
    const snapshot = await getDocs(testsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all tests:", error);
    return [];
  }
};

export const getTestById = async (testId) => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      return null;
    }
    const testRef = doc(db, 'tests', testId);
    const snapshot = await getDoc(testRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching test by id:", error);
    return null;
  }
};

export const createTest = async (testData) => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      return { success: false, error: new Error("Firebase not configured") };
    }
    const docRef = await addDoc(collection(db, 'tests'), {
      ...testData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating test:", error);
    return { success: false, error };
  }
};

export const deleteTest = async (testId) => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      return { success: false, error: new Error("Firebase not configured") };
    }
    await deleteDoc(doc(db, 'tests', testId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting test:", error);
    return { success: false, error };
  }
};


export const submitTestAttempt = async (attemptData) => {
  try {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      return { success: false, error: new Error("Firebase not configured") };
    }
    const docRef = await addDoc(collection(db, 'attempts'), {
      ...attemptData,
      submittedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting attempt:", error);
    return { success: false, error };
  }
};
