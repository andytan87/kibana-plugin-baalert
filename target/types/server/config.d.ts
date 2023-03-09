import { TypeOf } from '@kbn/config-schema';
import { PluginConfigDescriptor } from 'kibana/server';
declare const configSchema: import("@kbn/config-schema").ObjectType<{
    enabled: import("@kbn/config-schema").Type<boolean>;
    url: import("@kbn/config-schema").Type<string>;
    id: import("@kbn/config-schema").Type<string | undefined>;
    apm: import("@kbn/config-schema").Type<Readonly<{
        url?: string | undefined;
        secret_token?: string | undefined;
        ui?: Readonly<{
            url?: string | undefined;
        } & {}> | undefined;
    } & {}> | undefined>;
    cname: import("@kbn/config-schema").Type<string | undefined>;
    base_url: import("@kbn/config-schema").Type<string | undefined>;
    baalert_url: import("@kbn/config-schema").Type<string | undefined>;
    profile_url: import("@kbn/config-schema").Type<string | undefined>;
    deployment_url: import("@kbn/config-schema").Type<string | undefined>;
    organization_url: import("@kbn/config-schema").Type<string | undefined>;
    full_story: import("@kbn/config-schema").ObjectType<{
        enabled: import("@kbn/config-schema").Type<boolean>;
        url: import("@kbn/config-schema").Type<string>;
        org_id: import("@kbn/config-schema/target_types/types").ConditionalType<true, string, string | undefined>;
    }>;
}>;
export declare type CloudConfigType = TypeOf<typeof configSchema>;
export declare const config: PluginConfigDescriptor<CloudConfigType>;
export {};
//# sourceMappingURL=config.d.ts.map