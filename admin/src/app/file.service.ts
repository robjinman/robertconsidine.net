import { Injectable } from '@angular/core';
import { Mutation, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { File } from './types'
import { LoggingService } from './logging.service';

export interface FileDesc {
  documentId: string;
  data: string;
  name: string;
  extension: string;
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
        document {
          id
        }
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
        document {
          id
        }
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
              private uploadFileGql: UploadFileGql,
              private deleteFileGql: DeleteFileGql) {}

  uploadFile(file: FileDesc): Observable<File> {
    this.logger.add('Uploading file');

    return this.apollo.mutate({
      mutation: this.uploadFileGql.document,
      variables: {
        documentId: file.documentId,
        data: file.data,
        name: file.name,
        extension: file.extension
      }
    })
    .pipe(
      map(result => result.data.uploadFile)
    );
  }

  deleteFile(id: string): Observable<File> {
    this.logger.add(`Deleting file, id=${id}`);

    return this.apollo.mutate({
      mutation: this.deleteFileGql.document,
      variables: { id }
    })
    .pipe(
      map(result => result.data.deleteFile)
    );
  }
}
