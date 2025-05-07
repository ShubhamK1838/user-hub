
import type { SVGProps } from 'react';
import { Users } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Users className="h-8 w-8 text-primary" strokeWidth={2} {...props} />
  );
}

export function AppLogoText() {
  return (
     <div className="flex items-center gap-2">
        <Logo />
        <h1 className="text-xl font-bold text-primary">User Hub</h1>
      </div>
  )
}
