/* eslint-disable react/no-direct-mutation-state */
import { CopyBlock, dracula } from 'react-code-blocks';

type Props = {
  text: string;
  language: string;
};

const CodeBlock = ({ text, language }: Props) => {
  const copyBlockProps = {
    text: text,
    showLineNumbers: true,
    startingLineNumber: 1,
    theme: dracula,
    wrapLines: true,
    language: language,
    codeBlock: true,
  };
  return <CopyBlock {...copyBlockProps} />;
};

export default CodeBlock;
