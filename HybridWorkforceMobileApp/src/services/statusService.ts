const MOCK_MODE = true;

export type Status = "AVAILABLE" | "IDLE" | "OFFLINE";

export async function updateStatus(status: Status): Promise<{ success: boolean; status: Status }> {
  if (MOCK_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status });
      }, 800);
    });
  } else {
    // Replace with real API call when backend is ready
    const response = await fetch("/status/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return await response.json();
  }
}
