import { ExportResult } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import * as jaegerTypes from './types';
/**
 * Format and sends span information to Jaeger Exporter.
 */
export declare class JaegerExporter implements SpanExporter {
    private readonly _onShutdownFlushTimeout;
    private readonly _localConfig;
    private _isShutdown;
    private _shutdownFlushTimeout;
    private _shuttingDownPromise;
    private _sender?;
    constructor(config?: jaegerTypes.ExporterConfig);
    /** Exports a list of spans to Jaeger. */
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    /** Shutdown exporter. */
    shutdown(): Promise<void>;
    /** Transform spans and sends to Jaeger service. */
    private _sendSpans;
    private _append;
    private _getSender;
    private _flush;
}
//# sourceMappingURL=jaeger.d.ts.map