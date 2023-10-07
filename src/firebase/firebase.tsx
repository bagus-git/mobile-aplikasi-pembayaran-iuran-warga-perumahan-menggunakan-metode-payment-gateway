import { child, get, getDatabase, ref, remove, set } from "firebase/database";
import { firebaseApp } from "./firebaseConfig";

export const writeData = async <T,>(
  table: string,
  uniqueId: string,
  data: T
) => {
  let path = `${table}`;
  if (uniqueId) {
    path = `${table}/${uniqueId}`;
  }
  const db = getDatabase(firebaseApp);
  await set(ref(db, `${path}`), data);
};

export const readData = async <T,>(table: string, uniqueId?: string) => {
  const dbRef = ref(getDatabase(firebaseApp));
  try {
    let path = `${table}`;
    if (uniqueId) {
      path = `${table}/${uniqueId}`;
    }
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot.val() as T;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const deleteData = async (table: string, uniqueId: string) => {
  const dbRef = ref(getDatabase(firebaseApp));
  try {
    let path = `${table}`;
    if (uniqueId) {
      path = `${table}/${uniqueId}`;
    }
    await remove(child(dbRef, path));
    return true;
  } catch (e) {
    return false;
  }
};
