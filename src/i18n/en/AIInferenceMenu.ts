/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'documentation' },
	{ text: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },
	
	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview-aiinference', slug: '/documentation/products/ai/ai-inference/', hasLabel: 'menu.aiinference' },
	{ text: 'Get Started', header: true, anchor: true, type: 'learn', key: 'get-started-aiinference', slug: '/documentation/products/guides/ai-inference-agent/' },

    { text: ' Available Models', header: true, type: 'learn', key: 'aiinference.models',slug: '/documentation/products/ai/ai-inference/models/', items: [
		{ text: 'BAAI/bge reranker v2 m3', slug: '/documentation/products/ai/ai-inference/models/baai-bge-reranker-v2-m3', key: 'aiinference/BAAI/bge-reranker-v2-m3' },
		{ text: 'InternVL3', slug: '/documentation/products/ai/ai-inference/models/internvl3', key: 'aiinference/InternVL3' },
		{ text: 'Mistral 3 Small (24B AWQ)', slug: '/documentation/products/ai/ai-inference/models/mistral-3-small', key: 'aiinference/mistral-3-small' },
		{ text: 'Qwen2.5 VL AWQ 3B', slug: '/documentation/products/ai/ai-inference/models/qwen-2-5-vl-3b', key: 'aiinference/qwen-2-5-vl-awq-3b' },
		{ text: 'Qwen2.5 VL AWQ 7B', slug: '/documentation/products/ai/ai-inference/models/qwen-2-5-vl-7b', key: 'aiinference/qwen-2-5-vl-awq-7b' },
		{ text: 'Qwen3 30B A3B Instruct 2507 FP8', slug: '/documentation/products/ai/ai-inference/models/qwen3-30ba3b', key: 'aiinference/qwen-3-instruct' },
		{ text: 'Qwen3 Embedding 4B', slug: '/documentation/products/ai/ai-inference/models/qwen3-embedding-4b', key: 'aiinference/qwen3-embedding' },
		{ text: 'Nanonets-OCR-s', slug: '/documentation/products/ai/ai-inference/models/nanonets-ocr-s/', key: 'aiinference/nanonets-OCR-s' },
	]},

	{ text: 'Guides', header: true, type: 'learn', key: 'aiinference/guides', items: [
		{ text: 'Deploy AI Inference Starter kit', header: true, anchor: true, type: 'learn', key: 'aiinference/starter-kit', slug: '/documentation/products/guides/ai-inference-starter-kit' },
		{ text: 'Deploy LangGraph AI Agent Boilerplate', header: true, anchor: true, type: 'learn', key: 'aiinference/langgraph-boilerplate', slug: '/documentation/products/guides/langgraph-ai-agent-boilerplate' },
	]},



] as const;
