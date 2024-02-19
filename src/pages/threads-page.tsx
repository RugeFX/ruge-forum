import CategoryList from 'components/thread/category-list';
import ThreadsList from 'components/thread/threads-list';

export default function ThreadsPage() {
  return (
    <>
      <CategoryList />
      <section className="mb-4">
        <ThreadsList />
      </section>
    </>
  );
}
