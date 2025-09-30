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
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },
	
	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão Geral', header: true, anchor: true, type: 'learn', key: 'overview-aiinference', slug: '/documentacao/produtos/ai/ai-inference/', hasLabel: 'menu.aiinference' },
	//{ text: 'Comece Agora', header: true, anchor: true, type: 'learn', key: 'get-started-aiinference', slug: '/documentacao/produtos/guias/ai-inference-agent/' },

    { text: ' Modelos disponiveis', header: true, type: 'learn', key: 'aiinference.models',slug: '/documentacao/produtos/ai/ai-inference/modelos/', items: [
		{ text: 'BAAI/bge reranker v2 m3', slug: '/documentacao/produtos/ai/ai-inference/modelos/baai-bge-reranker-v2-m3/', key: 'aiinference/BAAI/bge-reranker-v2-m3' },
		{ text: 'InternVL3', slug: '/documentacao/produtos/ai/ai-inference/modelos/internvl3/', key: 'aiinference/InternVL3' },
		{ text: 'Mistral 3 Small (24B AWQ)', slug: '/documentacao/produtos/ai/ai-inference/modelos/mistral-3-small/', key: 'aiinference/mistral-3-small' },
		{ text: 'Qwen2.5 VL AWQ 3B', slug: '/documentacao/produtos/ai/ai-inference/modelos/qwen-2-5-vl-3b/', key: 'aiinference/qwen-2-5-vl-awq-3b' },
		{ text: 'Qwen2.5 VL AWQ 7B', slug: '/documentacao/produtos/ai/ai-inference/modelos/qwen-2-5-vl-7b/', key: 'aiinference/qwen-2-5-vl-awq-7b' },
		{ text: 'Qwen3 30B A3B Instruct 2507 FP8', slug: '/documentacao/produtos/ai/ai-inference/modelos/qwen3-30ba3b/', key: 'aiinference/qwen-3-instruct' },
		{ text: 'Qwen3 Embedding 4B', slug: '/documentacao/produtos/ai/ai-inference/modelos/qwen3-embedding-4b/', key: 'aiinference/qwen3-embedding' },
		{ text: 'Nanonets-OCR-s', slug: '/documentacao/produtos/ai/ai-inference/modelos/nanonets-ocr-s/', key: 'aiinference/nanonets-OCR-s' },
	]},

	{ text: 'Guias', header: true, type: 'learn', key: 'aiinference/guides', items: [
		{ text: 'Implemente o AI Inference Starter kit', header: true, anchor: true, type: 'learn', key: 'aiinference/starter-kit', slug: '/documentacao/produtos/guias/ai-inference-starter-kit/' },
		{ text: 'Implemente LangGraph AI Agent Boilerplate', header: true, anchor: true, type: 'learn', key: 'aiinference/langgraph-boilerplate', slug: '/documentacao/produtos/guias/langgraph-ai-agent-boilerplate/' },
	]},



] as const;
