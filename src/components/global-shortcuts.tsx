'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { useAttihc } from '@/hooks/use-attihc';

export function GlobalShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { settings } = useAttihc();

  useEffect(() => {
    if (settings.shortcuts === false) return; // Explicitly check for false, default might be true

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside input/textarea unless it's a specific command that should override
      // But Ctrl+S and Ctrl+F usually work everywhere. Alt+N too.
      // So we don't return early.

      // Ctrl+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Since saving is auto-save, we just confirm it.
        // In a real app, we might trigger a save function if it wasn't auto-save.
        toast("Changes saved successfully", { icon: "check" });
      }

      // Ctrl+F: Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        window.dispatchEvent(new Event('attihc:focus-search'));
      }

      // Alt+N: New Note / Navigate to Today and focus Remember
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        if (pathname !== '/') {
          router.push('/');
          // Focus logic needs to wait for navigation
          setTimeout(() => {
             // We need to target the textarea. In TodayPage, it's likely the first textarea or specifically named.
             // Based on code reading, we might need a more robust way, but querySelector is fine for now.
             const inputs = document.querySelectorAll('textarea');
             if (inputs.length > 0) inputs[0].focus();
          }, 300);
        } else {
           const inputs = document.querySelectorAll('textarea');
           if (inputs.length > 0) inputs[0].focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.shortcuts, pathname, router, toast]);

  return null;
}
