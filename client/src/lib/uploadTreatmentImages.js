// src/lib/uploadTreatmentImages.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "/firebase.js";

/**
 * Upload a list of image files to Firebase Storage and return download URLs.
 * @param {File[]} files
 * @param {string} slug - used in storage path, e.g. "treatments/<slug>/..."
 * @param {(pct: number, fileName: string) => void} [onProgress]
 * @returns {Promise<string[]>} download URLs
 */
export async function uploadTreatmentImages(files, slug, onProgress) {
  const list = Array.from(files || []);
  const urls = [];

  for (const file of list) {
    const path = `treatments/${slug}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    await new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          if (onProgress && snap.totalBytes) {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            onProgress(pct, file.name);
          }
        },
        reject,
        resolve
      );
    });

    const url = await getDownloadURL(task.snapshot.ref);
    urls.push(url);
  }
  return urls;
}
