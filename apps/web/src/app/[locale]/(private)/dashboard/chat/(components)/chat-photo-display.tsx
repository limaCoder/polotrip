'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ChatPhotoDisplayProps = {
  data: any
}

export function ChatPhotoDisplay({ data }: ChatPhotoDisplayProps) {
  // Handle different data types
  if (data.photos && Array.isArray(data.photos)) {
    return (
      <div className="space-y-4">
        {data.album && (
          <div>
            <h3 className="font-semibold">{data.album.title}</h3>
            <p className="text-sm text-muted-foreground">
              {data.album.photoCount} photos
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {data.photos.slice(0, 4).map((photo: any) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded overflow-hidden"
            >
              <Image
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.description || 'Photo'}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {data.photos.length > 4 && (
          <p className="text-xs text-muted-foreground">
            +{data.photos.length - 4} more photos
          </p>
        )}
      </div>
    )
  }

  if (data.stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trip Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Total Photos:</span>
            <span className="font-semibold">{data.stats.totalPhotos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Photos with Location:</span>
            <span className="font-semibold">
              {data.stats.photosWithLocation}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Unique Locations:</span>
            <span className="font-semibold">{data.stats.uniqueLocations}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fallback to JSON display
  return (
    <pre className="text-xs overflow-x-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
