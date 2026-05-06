import ReactionTester from '../components/ReactionTester';

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: 40 }}>
      <ReactionTester teamName="Team A" />
    </main>
  );
}
