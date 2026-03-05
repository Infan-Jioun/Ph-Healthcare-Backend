import { IQueryConfig, IQueryParams, PrismaCountAegs, PrismaFindManyAegs, PrismaModelDelegets } from "../interface/query.interface"
export class QueryBuilder<T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>> {
    private query: PrismaFindManyAegs;
    private countQuery: PrismaCountAegs;
    private page: number = 1;
    private limit: number = 10;
    private skip: number = 0;
    private sortBy: string = "createdAt";
    private sortOrder: "asc" | "desc" = "desc";
    private selectFields: Record<string, boolean | undefined>

    constructor(
        private model: PrismaModelDelegets,
        private queryParams: IQueryParams,
        private config: IQueryConfig
    ) {
        this.query = {
            where: {},
            include: {},
            orderBy: {},
            skip: 0,
            take: 10
        };
        this.countQuery = {
            where: {}
        }
    }

}