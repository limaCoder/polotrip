'use client'

import Image from 'next/image'
import { AlbumCard } from '@/components/AlbumCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ChatPhotoDisplayProps = {
  data: any
}

export function ChatPhotoDisplay({ data }: ChatPhotoDisplayProps) {
  // Handle albums array (from getUserAlbums or getAlbumByName)
  if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].title) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {data.slice(0, 6).map((album: any) => (
          <AlbumCard
            key={album.id}
            id={album.id}
            title={album.title}
            date={album.date || album.createdAt}
            photosCount={album.photoCount || 0}
            imageUrl={album.coverImageUrl || ''}
            stepAfterPayment={album.isPublished ? 'published' : 'upload'}
          />
        ))}
        {data.length > 6 && (
          <p className="col-span-full text-sm text-muted-foreground text-center">
            +{data.length - 6} more albums
          </p>
        )}
      </div>
    )
  }

  // Handle single album with photos (from getAlbumPhotos)
  if (data.album && data.photos && Array.isArray(data.photos)) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="border-b pb-3">
          <h3 className="font-semibold text-lg">{data.album.title}</h3>
          <p className="text-sm text-muted-foreground">
            {data.album.photoCount} photos in this album
          </p>
        </div>
        {data.photos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.photos.slice(0, 8).map((photo: any) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                >
                  <Image
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.description || photo.locationName || 'Photo'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {photo.locationName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        {photo.locationName}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {data.photos.length > 8 && (
              <p className="text-sm text-muted-foreground text-center">
                +{data.photos.length - 8} more photos
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No photos found in this album
          </p>
        )}
      </div>
    )
  }

  // Handle photos array without album context (from getPhotosByDate/Location)
  if (data.photos && Array.isArray(data.photos) && !data.album) {
    const context = data.date ? `on ${data.date}` : data.location ? `at ${data.location}` : ''
    return (
      <div className="space-y-4 max-w-4xl">
        {context && (
          <div className="border-b pb-3">
            <h3 className="font-semibold text-lg">Photos {context}</h3>
            <p className="text-sm text-muted-foreground">
              {data.photos.length} photos found
            </p>
          </div>
        )}
        {data.photos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.photos.slice(0, 8).map((photo: any) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                >
                  <Image
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.description || photo.locationName || 'Photo'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {photo.locationName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        {photo.locationName}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {data.photos.length > 8 && (
              <p className="text-sm text-muted-foreground text-center">
                +{data.photos.length - 8} more photos
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No photos found {context}
          </p>
        )}
      </div>
    )
  }

  // Handle trip statistics
  if (data.stats && data.album) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">
            Trip Statistics: {data.album.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Total Photos</span>
            <span className="text-lg font-bold text-primary">
              {data.stats.totalPhotos}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">With Location Data</span>
            <span className="text-lg font-bold text-primary">
              {data.stats.photosWithLocation}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Unique Locations</span>
            <span className="text-lg font-bold text-primary">
              {data.stats.uniqueLocations}
            </span>
          </div>
          {data.stats.dateRange && (
            <div className="pt-2 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                Date Range
              </p>
              <p className="text-sm">
                {data.stats.dateRange.start
                  ? new Date(data.stats.dateRange.start).toLocaleDateString()
                  : 'N/A'}{' '}
                -{' '}
                {data.stats.dateRange.end
                  ? new Date(data.stats.dateRange.end).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Handle search results with count
  if (data.albums && Array.isArray(data.albums) && data.query) {
    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-semibold text-lg">
            Search results for &quot;{data.query}&quot;
          </h3>
          <p className="text-sm text-muted-foreground">
            {data.count} albums found
          </p>
        </div>
        {data.albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {data.albums.slice(0, 6).map((album: any) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                title={album.title}
                date={album.date || album.createdAt}
                photosCount={album.photoCount || 0}
                imageUrl={album.coverImageUrl || ''}
                stepAfterPayment={album.isPublished ? 'published' : 'upload'}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No albums found matching &quot;{data.query}&quot;
          </p>
        )}
      </div>
    )
  }

  // Fallback: don't display anything for unstructured data
  // The AI will provide text explanation instead
  return null
}
