import { HandbookAssetSections } from './handbook-assets';
import { HandbookLifeSections } from './handbook-life';
import type { HandbookConfig } from './types';

type Props = {
  config: HandbookConfig;
};

export function Handbook({ config }: Props) {
  return (
    <form
      className="sheet"
      data-testid="printable-handbook"
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <HandbookLifeSections config={config} />
      <HandbookAssetSections config={config} />
    </form>
  );
}
