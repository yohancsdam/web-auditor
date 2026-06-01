import type { CategoryScore } from '../lib/audit/types';
import CategoryScoreCard from './CategoryScoreCard';

interface Props {
  category: CategoryScore;
  onSelect?: () => void;
  active?: boolean;
}

export default function ScoreCard(props: Props) {
  return <CategoryScoreCard {...props} />;
}
