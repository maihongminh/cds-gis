"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Switch } from "@/components/ui";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Sáng", icon: Sun },
    { value: "dark", label: "Tối", icon: Moon },
    { value: "system", label: "Theo hệ thống", icon: Monitor },
  ] as const;

  function handleChange(value: string) {
    setTheme(value);
    toast.success(`Đã chuyển sang giao diện ${themes.find((t) => t.value === value)?.label ?? value}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giao diện (Theme)</CardTitle>
        <CardDescription>Chọn giao diện hiển thị phù hợp với bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 flex-wrap">
          {themes.map(({ value, label, icon: Icon }) => (
            <Button key={value} id={`btn-theme-${value}`} variant={theme === value ? "default" : "outline"} className="flex-1 min-w-[120px] gap-2" onClick={() => handleChange(value)}>
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="setting-theme-toggle">Dark mode nhanh</Label>
            <p className="text-sm text-muted-foreground">Bật/tắt chế độ tối trực tiếp</p>
          </div>
          <Switch id="setting-theme-toggle" checked={theme === "dark"} onCheckedChange={(checked) => handleChange(checked ? "dark" : "light")} />
        </div>
      </CardContent>
    </Card>
  );
}
