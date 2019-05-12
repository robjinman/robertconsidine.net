import { Component,
         OnInit,
         ChangeDetectorRef,
         Output,
         EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';

import { ArticleService } from '../articles.service';

interface TagField {
  id: string,
  name: string,
  selected: boolean
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.styl']
})
export class TagsComponent implements OnInit {
  @Output() onChange = new EventEmitter();

  tags: TagField[] = [];

  constructor(private articleService: ArticleService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.articleService.getTags()
      .pipe(take(1))
      .subscribe(tags => {
        this.tags = tags.map(tag => {
          return {
            id: tag.id,
            name: tag.name,
            selected: false
          };
        });
        this.changeDetector.detectChanges();
      });
  }

  tagSelected(tagId: string): boolean {
    const tag = this.tags.find(tag => tag.id == tagId);
    return tag && tag.selected;
  }

  toggleTag(tagId: string) {
    const tag = this.tags.find(tag => tag.id == tagId);
    tag.selected = !tag.selected;
    this.changeDetector.detectChanges();

    this.onChange.emit(this.tags.filter(tf => tf.selected).map(tf => tf.id));
  }
}
