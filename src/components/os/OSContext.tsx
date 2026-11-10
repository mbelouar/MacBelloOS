'use client';

import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from 'react';

export type AppId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certifications'
  | 'contact'
  | 'terminal'
  | 'community'
  | 'resume';

export type AppParams = Record<string, string>;

export interface WinState {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Order in which the window was opened — used for cascading positions. */
  slot: number;
  params?: AppParams;
  /** Bumped whenever params change so apps can react to repeated requests. */
  paramsKey: number;
}

interface State {
  windows: WinState[];
  zTop: number;
  slotSeq: number;
  launch: { id: AppId; n: number } | null;
}

type Action =
  | { type: 'open'; id: AppId; params?: AppParams }
  | { type: 'close'; id: AppId }
  | { type: 'focus'; id: AppId }
  | { type: 'minimize'; id: AppId }
  | { type: 'toggleMaximize'; id: AppId }
  | { type: 'minimizeAll' }
  | { type: 'closeAll' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open': {
      const zTop = state.zTop + 1;
      const existing = state.windows.find((w) => w.id === action.id);
      if (existing) {
        return {
          ...state,
          zTop,
          windows: state.windows.map((w) =>
            w.id === action.id
              ? {
                  ...w,
                  z: zTop,
                  minimized: false,
                  params: action.params ?? w.params,
                  paramsKey: action.params ? w.paramsKey + 1 : w.paramsKey,
                }
              : w,
          ),
        };
      }
      return {
        zTop,
        slotSeq: state.slotSeq + 1,
        launch: { id: action.id, n: (state.launch?.n ?? 0) + 1 },
        windows: [
          ...state.windows,
          {
            id: action.id,
            z: zTop,
            minimized: false,
            maximized: false,
            slot: state.slotSeq,
            params: action.params,
            paramsKey: 0,
          },
        ],
      };
    }
    case 'close': {
      const windows = state.windows.filter((w) => w.id !== action.id);
      return { ...state, windows, slotSeq: windows.length === 0 ? 0 : state.slotSeq };
    }
    case 'focus': {
      const target = state.windows.find((w) => w.id === action.id);
      if (!target || (target.z === state.zTop && !target.minimized)) return state;
      const zTop = state.zTop + 1;
      return {
        ...state,
        zTop,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, z: zTop, minimized: false } : w)),
      };
    }
    case 'minimize':
      return {
        ...state,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)),
      };
    case 'toggleMaximize': {
      const zTop = state.zTop + 1;
      return {
        ...state,
        zTop,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, maximized: !w.maximized, z: zTop, minimized: false } : w,
        ),
      };
    }
    case 'minimizeAll':
      return { ...state, windows: state.windows.map((w) => ({ ...w, minimized: true })) };
    case 'closeAll':
      return { ...state, windows: [], slotSeq: 0 };
  }
}

export interface Toast {
  id: number;
  title: string;
  body?: string;
  icon?: React.ReactNode;
}

interface OSContextValue {
  windows: WinState[];
  focusedId: AppId | null;
  open: (id: AppId, params?: AppParams) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  minimizeAll: () => void;
  closeAll: () => void;
  /** Ids launched recently — the dock uses this to play the bounce animation. */
  launchTick: { id: AppId; n: number } | null;
  spotlightOpen: boolean;
  setSpotlightOpen: (open: boolean) => void;
  lock: () => void;
  toasts: Toast[];
  notify: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children, onLock }: { children: React.ReactNode; onLock: () => void }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], zTop: 10, slotSeq: 0, launch: null });
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastSeq = useRef(0);
  const open = useCallback((id: AppId, params?: AppParams) => dispatch({ type: 'open', id, params }), []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = ++toastSeq.current;
      setToasts((t) => [...t.slice(-2), { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 5200);
    },
    [dismissToast],
  );

  const focusedId = useMemo(() => {
    const visible = state.windows.filter((w) => !w.minimized);
    if (!visible.length) return null;
    return visible.reduce((a, b) => (b.z > a.z ? b : a)).id;
  }, [state.windows]);

  const value = useMemo<OSContextValue>(
    () => ({
      windows: state.windows,
      focusedId,
      open,
      close: (id) => dispatch({ type: 'close', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      toggleMaximize: (id) => dispatch({ type: 'toggleMaximize', id }),
      minimizeAll: () => dispatch({ type: 'minimizeAll' }),
      closeAll: () => dispatch({ type: 'closeAll' }),
      launchTick: state.launch,
      spotlightOpen,
      setSpotlightOpen,
      lock: onLock,
      toasts,
      notify,
      dismissToast,
    }),
    [state.windows, state.launch, focusedId, open, spotlightOpen, onLock, toasts, notify, dismissToast],
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used inside <OSProvider>');
  return ctx;
}
