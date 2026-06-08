import { EmbeddingService } from "./rag.embedding.service";
import { IndexingService } from "./rag.indexing.service";

export class RAGService {
    private embeddingService: EmbeddingService;
    private llmService: LLMService;
    private indexingService: IndexingService;
    constructor() {
        this.embeddingService = new EmbeddingService();
        this.llmService = new LLMService();
        this.indexingService = new IndexingService();
    }
    async ingestDoctorData() {
        return await this.indexingService.indexDoctorData() 
    }
}