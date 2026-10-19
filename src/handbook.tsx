import { HandbookAssetSections } from './handbook-assets';
import { HandbookLifeSections } from './handbook-life';
import type { HandbookConfig } from './types';

type Props = {
  config: HandbookConfig;
};

export function Handbook({ config }: Props) {
  return (
    <article className="sheet" data-testid="printable-handbook">
      <HandbookLifeSections config={config} />
      <HandbookAssetSections config={config} />
    </article>
  );
}
