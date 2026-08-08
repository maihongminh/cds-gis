// src/app/dashboard/map/page.tsx
// Main GIS dashboard page for Xa Lao Bao.
// This is a 'use client' page that owns all shared MapState and composes sub-components.
'use client';

import * as React from 'react';
import { LockKeyhole, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { MapShell } from '@/components/map/map-shell';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/components/ui';
import { MapToolbar } from './components/map-toolbar';
import { MapLayerPanel } from './components/map-layer-panel';
import { MapLegend } from './components/map-legend';
import { DisasterAlertPanel } from './components/disaster-alert-panel';
import { INITIAL_MAP_LAYERS, GIS_LAYER_GROUPS } from '@/data/mock-map-layers';
import { useTenant } from '@/components/layout/tenant-context';
import type { MapState } from '@/components/map/map-client';
import { DEFAULT_BASE_LAYER_ID, LAOBAO_CENTER } from '@/lib/map-config';

/** Commune center for "fit all" button */
const COMMUNE_CENTER: [number, number] = [LAOBAO_CENTER.lat, LAOBAO_CENTER.lng];
const SECURITY_GROUP_ID = 'security_defense';
const DEMO_SECURITY_PASSWORD = 'Daylamatkhau';
const SECURITY_LAYER_IDS = new Set(
  INITIAL_MAP_LAYERS.filter(
    (layer) => layer.dataGroup === SECURITY_GROUP_ID,
  ).map((layer) => layer.id),
);

type PendingSecurityAction =
  | { type: 'toggle-layer'; layerId: string }
  | { type: 'enable-group'; groupId: string };

export default function MapPage() {
  const { currentRole } = useTenant();

  // ── Layer visibility state ─────────────────────────────────────────────────
  const defaultActiveIds = INITIAL_MAP_LAYERS
    .filter((l) => l.visibleByDefault)
    .map((l) => l.id);

  const [activeLayerIds, setActiveLayerIds] = React.useState<string[]>(defaultActiveIds);
  const [layerFeatureCounts, setLayerFeatureCountsState] = React.useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(
      INITIAL_MAP_LAYERS.map((layer) => [layer.id, layer.featureCount ?? 0]),
    ),
  );
  const [isSecurityUnlocked, setIsSecurityUnlocked] = React.useState(false);
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] =
    React.useState(false);
  const [securityPassword, setSecurityPassword] = React.useState('');
  const [securityPasswordError, setSecurityPasswordError] =
    React.useState<string | null>(null);
  const [pendingSecurityAction, setPendingSecurityAction] =
    React.useState<PendingSecurityAction | null>(null);

  const toggleLayerDirectly = React.useCallback((id: string) => {
    setActiveLayerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const enableAllInGroupDirectly = React.useCallback((groupId: string) => {
    const group = GIS_LAYER_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setActiveLayerIds((prev) => {
      const next = new Set(prev);
      group.layers.forEach((lid) => next.add(lid));
      return Array.from(next);
    });
  }, []);

  const requestSecurityPassword = React.useCallback(
    (action: PendingSecurityAction) => {
      setPendingSecurityAction(action);
      setSecurityPassword('');
      setSecurityPasswordError(null);
      setIsSecurityDialogOpen(true);
    },
    [],
  );

  const toggleLayer = React.useCallback(
    (id: string) => {
      const isProtectedLayer = SECURITY_LAYER_IDS.has(id);
      const isActive = activeLayerIds.includes(id);
      if (isProtectedLayer && !isActive && !isSecurityUnlocked) {
        requestSecurityPassword({ type: 'toggle-layer', layerId: id });
        return;
      }

      toggleLayerDirectly(id);
      if (
        isProtectedLayer &&
        isActive &&
        !activeLayerIds.some(
          (layerId) => layerId !== id && SECURITY_LAYER_IDS.has(layerId),
        )
      ) {
        setIsSecurityUnlocked(false);
      }
    },
    [
      activeLayerIds,
      isSecurityUnlocked,
      requestSecurityPassword,
      toggleLayerDirectly,
    ],
  );

  const enableAllInGroup = React.useCallback(
    (groupId: string) => {
      const group = GIS_LAYER_GROUPS.find((item) => item.id === groupId);
      if (!group) return;
      const hasInactiveLayer = group.layers.some(
        (layerId) => !activeLayerIds.includes(layerId),
      );
      if (
        groupId === SECURITY_GROUP_ID &&
        hasInactiveLayer &&
        !isSecurityUnlocked
      ) {
        requestSecurityPassword({ type: 'enable-group', groupId });
        return;
      }
      enableAllInGroupDirectly(groupId);
    },
    [
      activeLayerIds,
      enableAllInGroupDirectly,
      isSecurityUnlocked,
      requestSecurityPassword,
    ],
  );

  const disableAllInGroup = React.useCallback((groupId: string) => {
    const group = GIS_LAYER_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setActiveLayerIds((prev) => prev.filter((id) => !group.layers.includes(id)));
    if (groupId === SECURITY_GROUP_ID) setIsSecurityUnlocked(false);
  }, []);

  const resetToDefaults = React.useCallback(() => {
    setActiveLayerIds(defaultActiveIds);
    setIsSecurityUnlocked(false);
  }, [defaultActiveIds]);

  const setLayerFeatureCounts = React.useCallback(
    (counts: Record<string, number>) => {
      setLayerFeatureCountsState((current) => {
        const layerIds = new Set([
          ...Object.keys(current),
          ...Object.keys(counts),
        ]);
        const hasChanged = Array.from(layerIds).some(
          (layerId) => (current[layerId] ?? 0) !== (counts[layerId] ?? 0),
        );
        return hasChanged ? counts : current;
      });
    },
    [],
  );

  function closeSecurityDialog() {
    setIsSecurityDialogOpen(false);
    setPendingSecurityAction(null);
    setSecurityPassword('');
    setSecurityPasswordError(null);
  }

  function handleSecurityPasswordSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (securityPassword !== DEMO_SECURITY_PASSWORD) {
      setSecurityPasswordError('Mật khẩu không đúng. Vui lòng thử lại.');
      return;
    }

    const action = pendingSecurityAction;
    setIsSecurityUnlocked(true);
    setIsSecurityDialogOpen(false);
    setPendingSecurityAction(null);
    setSecurityPassword('');
    setSecurityPasswordError(null);

    if (action?.type === 'toggle-layer') {
      toggleLayerDirectly(action.layerId);
    } else if (action?.type === 'enable-group') {
      enableAllInGroupDirectly(action.groupId);
    }
    toast.success('Đã mở khóa lớp Quốc phòng - An ninh.');
  }

  // ── Map navigation state ───────────────────────────────────────────────────
  const [selectedVillageCode, setSelectedVillageCode] = React.useState<string | null>(null);
  const [flyToCoords, setFlyToCoords] = React.useState<
    [number, number, number?] | null
  >(null);
  const [activeBaseLayerId, setActiveBaseLayerId] = React.useState(DEFAULT_BASE_LAYER_ID);
  // ── UI state ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = React.useState(true);
  const [isLegendCollapsed, setIsLegendCollapsed] = React.useState(false);
  const [isAlertCollapsed, setIsAlertCollapsed] = React.useState(true);
  const restoreLayerPanelAfterEditRef = React.useRef(false);
  const isPlanningComparisonActiveRef = React.useRef(false);

  // Detect mobile via window width (hydration-safe)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Shared MapState object passed to MapShell / MapClient ─────────────────
  const mapState: MapState = React.useMemo(
    () => ({
      activeLayerIds,
      toggleLayer,
      enableAllInGroup,
      disableAllInGroup,
      resetToDefaults,
      layerFeatureCounts,
      setLayerFeatureCounts,
      selectedVillageCode,
      setSelectedVillageCode,
      searchQuery,
      setSearchQuery,
      flyToCoords,
      setFlyToCoords,
      activeBaseLayerId,
      setActiveBaseLayerId,
      currentRole: currentRole ?? null,
    }),
    [
      activeLayerIds,
      toggleLayer,
      enableAllInGroup,
      disableAllInGroup,
      resetToDefaults,
      layerFeatureCounts,
      setLayerFeatureCounts,
      selectedVillageCode,
      searchQuery,
      flyToCoords,
      activeBaseLayerId,
      currentRole,
    ]
  );

  function handleFitCommune() {
    setSelectedVillageCode(null);
    setFlyToCoords([...COMMUNE_CENTER, 14]);
  }

  const handleObjectEditorOpen = React.useCallback(() => {
    setIsLayerPanelOpen((isOpen) => {
      if (isOpen) restoreLayerPanelAfterEditRef.current = true;
      return false;
    });
  }, []);

  const handleObjectEditorClose = React.useCallback(() => {
    if (isPlanningComparisonActiveRef.current) return;
    if (!restoreLayerPanelAfterEditRef.current) return;
    restoreLayerPanelAfterEditRef.current = false;
    setIsLayerPanelOpen(true);
  }, []);

  const handlePlanningComparisonOpen = React.useCallback(() => {
    isPlanningComparisonActiveRef.current = true;
    setIsLayerPanelOpen((isOpen) => {
      if (isOpen) restoreLayerPanelAfterEditRef.current = true;
      return false;
    });
  }, []);

  const handlePlanningComparisonClose = React.useCallback(() => {
    isPlanningComparisonActiveRef.current = false;
    if (!restoreLayerPanelAfterEditRef.current) return;
    restoreLayerPanelAfterEditRef.current = false;
    setIsLayerPanelOpen(true);
  }, []);

  const handleToggleLayerPanel = React.useCallback(() => {
    if (isPlanningComparisonActiveRef.current) {
      toast.info(
        'Hãy hoàn tất hoặc đóng chế độ so sánh trước khi mở catalog lớp dữ liệu.',
      );
      return;
    }
    setIsLayerPanelOpen((isOpen) => !isOpen);
  }, []);

  return (
    <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] xl:w-[calc(100%+4rem)] h-[calc(100vh-4rem)] -m-4 md:-m-6 xl:-m-8 overflow-hidden animate-fade-in">
      {/* Map container */}
      <div className="absolute inset-0 z-0">
        <MapShell
          mapState={mapState}
          onObjectEditorOpen={handleObjectEditorOpen}
          onObjectEditorClose={handleObjectEditorClose}
          onPlanningComparisonOpen={handlePlanningComparisonOpen}
          onPlanningComparisonClose={handlePlanningComparisonClose}
          minHeight={480}
        />
      </div>

      {/* ── Toolbar — top center ── */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-1000 pointer-events-none">
        <div className="pointer-events-auto">
          <MapToolbar
            mapState={mapState}
            onToggleLayerPanel={handleToggleLayerPanel}
            isLayerPanelOpen={isLayerPanelOpen}
            onFitCommune={handleFitCommune}
          />
        </div>
      </div>

      {/* ── Layer Panel (desktop inline, mobile Sheet) ── */}
      <MapLayerPanel
        mapState={mapState}
        isOpen={isLayerPanelOpen}
        onClose={() => setIsLayerPanelOpen(false)}
        isMobile={isMobile}
      />

      <Dialog
        open={isSecurityDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeSecurityDialog();
        }}
      >
        <DialogContent
          className="z-[1501] gap-4 border-border bg-card sm:max-w-sm"
          overlayClassName="z-[1500] bg-black/65"
        >
          <DialogHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
              <LockKeyhole className="size-4.5" />
            </div>
            <DialogTitle className="text-sm">
              Mở khóa lớp Quốc phòng - An ninh
            </DialogTitle>
            <DialogDescription className="text-xs leading-5">
              Nhập mật khẩu để hiển thị dữ liệu thuộc nhóm bảo vệ. Đây là cơ
              chế demo và sẽ được thay bằng phân quyền hệ thống sau này.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSecurityPasswordSubmit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="security-layer-password" className="text-xs">
                Mật khẩu
              </Label>
              <Input
                id="security-layer-password"
                type="password"
                value={securityPassword}
                onChange={(event) => {
                  setSecurityPassword(event.target.value);
                  setSecurityPasswordError(null);
                }}
                autoFocus
                autoComplete="current-password"
                placeholder="Nhập mật khẩu..."
                className="h-9 text-xs"
                aria-invalid={Boolean(securityPasswordError)}
                aria-describedby={
                  securityPasswordError
                    ? 'security-layer-password-error'
                    : 'security-layer-password-hint'
                }
              />
              {securityPasswordError ? (
                <p
                  id="security-layer-password-error"
                  className="text-[10px] font-medium text-destructive"
                >
                  {securityPasswordError}
                </p>
              ) : (
                <p
                  id="security-layer-password-hint"
                  className="text-[10px] text-muted-foreground"
                >
                  Mật khẩu demo: <code>Daylamatkhau</code>
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeSecurityDialog}
                className="h-8 text-xs"
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs">
                Mở khóa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Legend — bottom left ── */}
      <div className="absolute bottom-8 right-12 z-1000 w-42">
        <MapLegend
          activeLayerIds={activeLayerIds}
          collapsed={isLegendCollapsed}
          onToggleCollapse={() => setIsLegendCollapsed((p) => !p)}
        />
      </div>

      {/* ── Disaster alert panel — bottom right ── */}
      <div className="absolute top-17 right-2.5 z-1000 w-43">
        <DisasterAlertPanel
          collapsed={isAlertCollapsed}
          onToggleCollapse={() => setIsAlertCollapsed((prev) => !prev)}
        />
      </div>

      {/* ── Mock data disclaimer ── */}
      <div className="absolute bottom-0 right-0 z-1000 flex items-center gap-1.5 px-2 py-1.5 rounded-tl-lg bg-background/90 backdrop-blur-xs border-t border-l border-border/80 shadow-sm">
        <ShieldAlert className="size-3 text-amber-500 shrink-0" />
        <p className="text-[8px] text-muted-foreground leading-none">
          Ranh giới xã/thôn nghiệp vụ là dữ liệu mô phỏng. Nền hành chính và dữ liệu Hoàng Sa, Trường Sa được tải từ gis.vn; không dùng thay hồ sơ pháp lý. Hệ quy chiếu: EPSG:4326
        </p>
      </div>
    </div>
  );
}
