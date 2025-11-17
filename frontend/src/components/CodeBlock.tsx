'use client';
import React from 'react';
import { Clipboard } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { Button } from './ui/button';

export interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  src?: string;
}

const ButtonCopy = ({ content }: { content: string }) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard
          .writeText(content)
          .then(() => {
            console.log('Code copied to clipboard:', content);
            // Optionally, you can show a success message or change the button state
            toast('Le code a été copié dans le presse-papiers', {
              description: 'Vous pouvez maintenant le coller où vous voulez.',
            });
          })
          .catch((err) => {
            console.error('Failed to copy code: ', err);
          });
      }}
      type="button"
      variant={'outline'}
      className="flex justify-center items-center text-accent p-2 h-8 w-8 cursor-pointer"
    >
      <Clipboard className="h-4 w-4 text-primary" />
    </Button>
  );
};

export const CodeBlock = ({
  children,
  language = 'typescript',
  src = './src/components/CodeBlock.tsx',
}: CodeBlockProps) => {
  return (
    <div className="border bg-card border-accent rounded-lg py-2 px-2 shadow-md">
      <div className="flex flex-row justify-between w-full p-2">
        <div className="flex flex-col items-start">
          <div className="flex flex-row justify-center items-center mb-1 gap-2 h-full">
            <div className="rounded h-2 w-2 bg-red-500"></div>
            <div className="rounded h-2 w-2 bg-yellow-500"></div>
            <div className="rounded h-2 w-2 bg-green-500"></div>
          </div>
          <span className="text-muted-foreground text-xs">{src}</span>
        </div>
        <ButtonCopy content={children ? children.toString() : ''} />
      </div>

      <SyntaxHighlighter
        className="rounded-[0px_0px_6px_6px] px-4"
        wrapLines
        showLineNumbers
        language={language}
        style={oneDark}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
