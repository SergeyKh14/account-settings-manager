export const queryKeys = {
  accounts: {
    all: () => ['accounts'] as const,
    detail: (id: string) => ['accounts', id] as const,
    settings: (id: string) => ['accounts', id, 'settings'] as const,
  },
  settings: {
    definitions: () => ['settings', 'definitions'] as const,
  },
} as const;
