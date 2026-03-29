import BookCard from '@/components/BookCard'
import HeroSection from '@/components/HeroSection'
import Search from '@/components/Search';
import { getAllBooks } from '@/lib/actions/book.actions'
import { auth } from '@clerk/nextjs/server'


//this will force a new fetch o fthe book data on every request, ensuring the library is always up to date with the latest books
export const dynamic = 'force-dynamic';

const Page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
    // Get the current user
    const { userId } = await auth();

    //fetch all books from the database and display them in the library section, sorted by most recent
     const { query } = await searchParams;

    const bookResults = await getAllBooks(query, userId ?? undefined);
    const books = bookResults.success ? bookResults.data ?? [] : [];
    return (
        <main className="wrapper container">
            <HeroSection />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
                <h2 className="text-3xl font-serif font-bold text-[#212a3b]">Recent Books</h2>
                <Search />
            </div>

           {!userId ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            Sign in to view your uploaded books.
          </p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            You haven’t uploaded any books yet.
          </p>
        </div>
      ) : (
        <div className="library-books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
        ))}
      </div>
      )}
        </main>
    )
}
export default Page
