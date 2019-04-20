import { Injectable } from '@angular/core';
import { Mutation, Apollo, Query } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import gql from 'graphql-tag';

import { File } from './types'
import { LoggingService } from './logging.service';

const BUCKET_URL = "https://s3.eu-west-2.amazonaws.com/assets.robjinman.com";

export interface FileDesc {
  documentId: string;
  data: string;
  name: string;
  extension: string;
}

interface GetFilesResponse {
  files: File[]
}

@Injectable({
  providedIn: 'root'
})
export class GetFilesGql extends Query<GetFilesResponse> {
  document = gql`
    query files($documentId: ID!) {
      files(documentId: $documentId) {
        id
        name
        extension
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
class UploadFileGql extends Mutation {
  document = gql`
    mutation uploadFile($documentId: ID!,
                        $data: String!,
                        $name: String!,
                        $extension: String!) {
      uploadFile(
        documentId: $documentId
        data: $data
        name: $name
        extension: $extension
      ) {
        id
        name
        extension
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
class DeleteFileGql extends Mutation {
  document = gql`
    mutation deleteFile($id: ID!) {
      deleteFile(
        id: $id
      ) {
        id
        name
        extension
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private apollo: Apollo,
              private logger: LoggingService,
              private getFilesGql: GetFilesGql,
              private uploadFileGql: UploadFileGql,
              private deleteFileGql: DeleteFileGql) {}

  getUrl(id: string): string {
    return BUCKET_URL + "/" + id;
  }

  getFiles(documentId: string): Observable<File[]> {
    return this.getFilesGql.watch({documentId: documentId})
      .valueChanges
      .pipe(
        map(result => result.data.files),
        tap(() => {
          this.logger.add(`Fetched files for document, id=${documentId}`);
        }, () => {
          this.logger.add(
            `Failed to Fetch files for document, id=${documentId}`);
        })
      );
  }

  uploadFile(file: FileDesc): Observable<File> {
    return this.apollo.mutate({
      mutation: this.uploadFileGql.document,
      variables: {
        documentId: file.documentId,
        data: file.data,
        name: file.name,
        extension: file.extension
      },
      refetchQueries: [{
        query: this.getFilesGql.document,
        variables: { documentId: file.documentId }
      }]
    })
    .pipe(
      map(result => result.data.uploadFile),
      tap(() => {
        this.logger.add(`Uploaded file ${file.name}.${file.extension}`);
      }, () => {
        this.logger.add(`Failed to upload file ${file.name}.${file.extension}`);
      })
    );
  }

  deleteFile(documentId: string, id: string): Observable<File> {
    return this.apollo.mutate({
      mutation: this.deleteFileGql.document,
      variables: { id },
      refetchQueries: [{
        query: this.getFilesGql.document,
        variables: { documentId: documentId }
      }]
    })
    .pipe(
      map(result => result.data.deleteFile),
      tap(() => {
        this.logger.add(`Deleted file, id=${id}`);
      }, () => {
        this.logger.add(`Failed to delete file, id=${id}`);
      })
    );
  }
}
