import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService
  ) {}

  async createIndex() {
    const index = this.configService.get("ELASTIC_INDEX");
    const checkIndex: any = await this.esService.indices.exists({ index });

    if (checkIndex.statusCode === 404) {
      this.esService.indices.create({ index }).catch((err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }

  async indexPost(post: any) {
    return await this.esService.index({
      index: this.configService.get("ELASTIC_INDEX"),
      body: post,
    });
  }

  async search(text: string) {
    const { hits: body } = await this.esService.search<any>({
      index: this.configService.get("ELASTIC_INDEX"),
      body: {
        query: {
          match_all: {},
        },
      },
    });

    const hits = body.hits;
    return hits.map((hit: any) => hit._source);
  }
}
