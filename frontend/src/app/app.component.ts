import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { BackendStatusService } from './core/services/backend-status.service'

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	constructor(private backendStatusService: BackendStatusService) {}

	ngOnInit() {
		this.backendStatusService.init()
	}
}
