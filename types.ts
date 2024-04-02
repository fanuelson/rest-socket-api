export interface EmitEventRequestBody {
    namespace?: string;
    eventName: string,
    args: any[]
}