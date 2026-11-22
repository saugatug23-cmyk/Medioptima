import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Construction } from 'lucide-react';

export function PlaceholderPage({ title, description, moduleName }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Card className="w-full max-w-md text-center border-dashed border-2 border-slate-300">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Construction className="h-6 w-6 text-slate-500" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
            This section will be powered by the <strong>{moduleName}</strong> which will be connected in future development steps.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
