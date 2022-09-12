import { ClipboardCheck, PasteClipboard } from 'iconoir-react';
import React, { useCallback, useState } from 'react';

import Button from '../../atoms/Button';

type Props = {
  url: string;
  onClick?: () => void;
  [x: string]: any;
};

const CopyUrlButton: React.FC<Props> = ({ url, onClick, ...rest }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((copyString: string) => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = copyString;
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 800);
  }, []);

  const handleClick = () => {
    copyToClipboard(url);
    if (onClick) onClick();
  };

  return (
    <Button color={copied ? 'green' : 'yellow'} onClick={handleClick} {...rest}>
      {copied ? <ClipboardCheck /> : <PasteClipboard />}
    </Button>
  );
};

export default CopyUrlButton;
