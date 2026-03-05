import { IQueryConfig, IQueryParams, PrismaCountAegs, PrismaFindManyAegs, PrismaModelDelegets, PrismaStringFilter, PrismaWhereConditions } from "../interface/query.interface"
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
    search(): this {
        const { searchItem } = this.queryParams;
        const { searchAbleFields } = this.config;
        if (searchItem && searchAbleFields && searchAbleFields.length > 0) {
            const searchConditions: Record<string, unknown>[] = searchAbleFields.map((field) => {
                if (field.includes(".")) {
                    const parts = field.split(".");
                    if (parts.length === 2) {
                        const [relations, nestedField] = parts;
                        const stringFilter = {
                            contains: searchItem,
                            node: "insensitive" as const
                        }
                        return {
                            [relations]: {
                                [nestedField]: stringFilter
                            }
                        }
                    } else if (parts.length === 3) {
                        const [relations, nestedRelations, nestedField] = parts;
                        const stringFilter: PrismaStringFilter = {
                            contains: searchItem,
                            node: "insensitive" as const
                        }
                        return {
                            [relations]: {
                                [nestedRelations]: {
                                    [nestedField]: stringFilter
                                }
                            }
                        }
                    }
                }
                //! Direct fields 
                const stringFilter: PrismaStringFilter = {
                    contains: searchItem,
                    node: "insensitive" as const
                }
                return {
                    [field]: stringFilter
                }

            })
            //! Where Conditions 
            const whereConditions = this.query.where as PrismaWhereConditions
            whereConditions.OR = searchConditions;
            const countWhereConditions = this.countQuery.where as PrismaWhereConditions;
            countWhereConditions.OR = searchConditions;
        }
        return this;
    }

}