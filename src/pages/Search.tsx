import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, BookOpen } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  author_id: string;
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`https://backend.youware.com/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    handleSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tìm kiếm truyện</h1>

      <form onSubmit={onSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên truyện hoặc mô tả..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-lg"
            autoFocus
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Tìm
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tìm kiếm...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {hasSearched && results.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p className="text-gray-500">Thử tìm với từ khóa khác xem sao</p>
            </div>
          )}

          {results.map((story) => (
            <Link 
              key={story.id} 
              to={`/story/${story.id}`}
              className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <img 
                src={story.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'} 
                alt={story.title}
                className="w-24 h-36 object-cover rounded-lg shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{story.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-2">{story.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>ID: {story.id}</span>
                  <span>•</span>
                  <span>Tác giả: {story.author_id.substring(0, 8)}...</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
