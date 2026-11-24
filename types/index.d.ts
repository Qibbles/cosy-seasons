export type ContextPercent = number | null

declare module 'claude-code' {
  interface PluginState {
    'cosy-seasons': { contextPercent: ContextPercent }
  }
}
