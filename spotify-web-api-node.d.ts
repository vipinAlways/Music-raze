// types/spotify-web-api-node.d.ts

declare module 'spotify-web-api-node' {
    interface Credentials {
      clientId: string;
      clientSecret: string;
      accessToken?: string;
      refreshToken?: string;
      redirectUri?: string;
    }
  
    interface TrackObjectSimplified {
      name: string;
      id: string;
      href: string;
      uri: string;
      duration_ms: number;
    }
  
    interface ArtistObjectSimplified {
      name: string;
      id: string;
      href: string;
      uri: string;
    }
  
    interface AlbumObjectSimplified {
      name: string;
      id: string;
      href: string;
      uri: string;
      release_date: string;
      total_tracks: number;
    }
  
    interface UserObjectPrivate {
      display_name: string;
      id: string;
      email: string;
      href: string;
      uri: string;
    }
  
    class SpotifyWebApi {
      searchTracks(arg0: string) {
        throw new Error('Method not implemented.');
      }
      constructor(credentials?: Credentials);
  
      setAccessToken(accessToken: string): void;
      setRefreshToken(refreshToken: string): void;
  
      getMe(): Promise<{ body: UserObjectPrivate }>;
      getTrack(id: string): Promise<{ body: TrackObjectSimplified }>;
      getArtist(id: string): Promise<{ body: ArtistObjectSimplified }>;
      getAlbum(id: string): Promise<{ body: AlbumObjectSimplified }>;
  
      refreshAccessToken(): Promise<{ body: { access_token: string } }>;
      authorizationCodeGrant(code: string): Promise<{ body: { access_token: string, refresh_token: string } }>;
    }
  
    export = SpotifyWebApi;
  }
  