export async function pinJSON(params: {
  data: string | object;
  name: string;
  keyvalues?: object;
  auth: string;
}): Promise<string | undefined> {
  const { data, name, keyvalues, auth } = params;

  try {
    const pinataData = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name,
        keyvalues,
      },
      pinataContent: data,
    };

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth,
      },
      body: JSON.stringify(pinataData),
    });

    if (!res.ok) {
      throw new Error(`Pinata error: status: ${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    console.log("saveToIPFS result:", responseData);
    return (
      responseData as unknown as { IpfsHash: string | undefined } | undefined
    )?.IpfsHash;
  } catch (error: any) {
    console.error("saveToIPFS error:", error?.message);
    return undefined;
  }
}
