'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { TrendingUpIcon } from 'lucide-react';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-28 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-8">
					<Link href="/" className="hover:bg-accent rounded-md flex items-center gap-2">
                        <img src="/logo.png" alt="Qbix Logo" className="h-24 w-auto object-contain" />
					</Link>
					
					{/* Desktop Links */}
					<div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
						<Link href="/dashboard" className="hover:text-foreground transition-colors">
							Dashboard
						</Link>
						<Link href="/onboarding" className="hover:text-foreground transition-colors">
							Organizations
						</Link>
					</div>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button variant="outline" asChild>
						<Link href="/login">Login</Link>
					</Button>
					<Button asChild>
						<Link href="/register">Get Started</Link>
					</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<div className="flex w-full flex-col gap-y-4 pt-4">
					<Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
						Dashboard
					</Link>
					<Link href="/onboarding" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
						Organizations
					</Link>
				</div>
				<div className="flex flex-col gap-2 pb-4">
					<Button variant="outline" className="w-full bg-transparent" asChild>
						<Link href="/login" onClick={() => setOpen(false)}>Login</Link>
					</Button>
					<Button className="w-full" asChild>
						<Link href="/register" onClick={() => setOpen(false)}>Get Started</Link>
					</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
				'fixed top-20 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}
