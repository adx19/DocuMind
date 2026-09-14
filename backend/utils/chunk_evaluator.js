const groq = require("./groq");


const evaluateChunk = async (query, chunk) => {
	try {
		const prompt = `
		Query:
		${query}

		Chunk:
		${chunk}

		Determine whether this chunk contains information that can directly help answer the query.

		Return ONLY:
		YES
		or
		NO

		Return YES if the chunk contains the answer or directly relevant information.
		Return NO if it does not contain useful information for answering the query.
		Do not explain your decision.
		`;

		const systemPrompt=`
		You are an AI that check whether given chunk matches the context of the given query.
		Do NOT answer the query.
		Only check the relevance.
		`;

		const response = await groq.chat.completions.create({
			model: "openai/gpt-oss-20b",
			messages: [
				{
					role:"system",
					content:systemPrompt
				},
				{
					role:"user",
					content:prompt,
				},
			],
			temperature:0,
		});
		const result = response.choices[0]?.message?.content?.trim().toUpperCase();

		const score = result === "YES" ? 100 : 0;

		console.log("Chunk score:", score);

		return score;
	} catch (error){
		console.error(error);
		
		return 0;
	}

};

module.exports = evaluateChunk;
