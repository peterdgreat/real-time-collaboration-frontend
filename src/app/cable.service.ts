import { Injectable } from '@angular/core';
import * as ActionCable from '@rails/actioncable';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CableService {
  private cable: any;
  public documentUpdates = new Subject<any>();

  constructor() {
    this.cable = ActionCable.createConsumer('ws://localhost:3000/cable'); // Adjust URL as needed
    // this.subscribeToDocument('document_1'); // Ensure this matches the broadcast ID
  }

  subscribeToDocument(documentId: string) {
    this.cable.subscriptions.create(
      { channel: 'DocumentChannel', document_id: documentId },
      {
        received: (data: any) => {
          console.log('Received data:', data); // Log incoming data
          this.documentUpdates.next(data); // Emit data to subscribers
        },
        connected: () => {
          console.log('Connected to DocumentChannel');
        },
        disconnected: () => {
          console.log('Disconnected from DocumentChannel');
        },
        rejected: () => {
          console.error('Subscription rejected');
        },
      }
    );
  }

  // Unsubscribe from the channel
  unsubscribe() {
    if (this.cable.subscriptions) {
      this.cable.subscriptions.remove(this.cable.subscriptions);
    }
  }

  // Get document updates as an observable
  getDocumentUpdates() {
    return this.documentUpdates.asObservable();
  }
}
