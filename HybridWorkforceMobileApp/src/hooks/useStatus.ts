import { useState } from "react";
import { updateStatus, Status } from "../services/statusService";

// re-export type for convenience
export type { Status };

export function useStatus() {
  const [currentStatus, setCurrentStatus] = useState<Status>("OFFLINE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = async (newStatus: Status) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateStatus(newStatus);
      if (result.success) {
        setCurrentStatus(result.status);
      } else {
        setError("Failed to update status.");
      }
    } catch (e: any) {
      setError(e.message || "Error updating status.");
    } finally {
      setLoading(false);
    }
  };

  return { currentStatus, loading, error, changeStatus };
}
