export async function toggleAccountValidityById(accountId: string) {
  try {
    const response = await fetch(`/api/account/toggle-validity/${accountId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to toggle account validity");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[TOGGLE_ACCOUNT_VALIDITY]", error);
    throw error;
  }
} 