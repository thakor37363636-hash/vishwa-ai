export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { message } = await request.json();

        if (!message || typeof message !== "string") {
          return Response.json({ error: "સંદેશ લખો." }, { status: 400 });
        }

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: message }] }]
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return Response.json(
            { error: data.error?.message || "AI સેવા અત્યારે ઉપલબ્ધ નથી." },
            { status: response.status }
          );
        }

        return Response.json({
          reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "જવાબ મળ્યો નથી."
        });
      } catch (error) {
        return Response.json({ error: "વિનંતી પૂર્ણ થઈ નથી." }, { status: 500 });
      }
    }

    return new Response("VISHWA AI Worker is running.");
  }
};
