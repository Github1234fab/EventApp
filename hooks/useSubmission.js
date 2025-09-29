import { useEffect, useMemo, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../components/Firebase"; // adapte le chemin si besoin

export function useSubmission(submissionId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!submissionId);
  const [error, setError] = useState(null);

  const wasPaidRef = useRef(false);

  const ref = useMemo(() => {
    if (!submissionId) return null;
    return doc(db, "Submissions", submissionId);
  }, [submissionId]);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const d = snap.exists() ? snap.data() : null;
        setData(d);
        setLoading(false);
      },
      (e) => {
        setError(e);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [ref]);

  const justPaid = !!data && data.paid === true && wasPaidRef.current === false;

  useEffect(() => {
    if (data && data.paid) wasPaidRef.current = true;
  }, [data && data.paid]);

  return { data, loading, error, justPaid };
}
