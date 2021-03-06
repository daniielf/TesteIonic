import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output('loginEvent') loginEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output('slideToRegister') slideToRegister: EventEmitter<any> = new EventEmitter<any>();
  @Output('forgotPassEvent') forgotPassEvent: EventEmitter<any> = new EventEmitter<any>();

  public loginForm: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private loadService: LoadingService,
  ) {
    this.loginForm = this.buildLoginForm();
  }

  ngOnInit() {
  }

  /**
  * Aciona um OutputEvent com as credenciais do usuario
  * @return {void}
  */
  private loginButtonPressed() {
    this.toastService.dismissToast();
    if (this.isFormValid()) {
      const loginAuth = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value
      };
      this.loginEvent.emit(loginAuth);
    }
  }

  /**
  * Aciona um OutputEvent para alternar slide para Registro
  * @return {void}
  */
  private registerButtonPressed() {
    this.slideToRegister.emit();
  }

  /**
  * Emite um alerta para recuperação de senha
  * @return {void}
  */
  private forgotPassButtonPressed() {
    this.alertCtrl.create({
      message: 'Digite seu email para refazer sua senha:',
      inputs: [
        {
          type: 'email',
          name: 'email',
          id: 'email',
          placeholder: 'exemplo@email.com'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            this.sendforgotPassEvent(data.email);
          }
        },
      ]
    }).then((res) => {
      res.present();
    });
  }

  /**
  * Constrói o grupo de formulário de email e senha para realização de autenticação
  * @return {FormGroup}
  */
  private buildLoginForm() {
    return this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  /**
  * Aciona um OutputEvent com o email do usuario
  * @param {String} email Email do usuario
  * @return {void}
  */
  private sendforgotPassEvent(email) {
    this.forgotPassEvent.emit(email);
  }

  /**
  * Retorna um booleano indicando a validação de formulario
  * @return {Boolean}
  */
  private isFormValid() {
    if (this.loginForm.get('email').errors) {
      this.toastService.showToastAlert(this.getErrorMessage('Email', this.loginForm.get('email').errors));
      return false;
    }
    if (this.loginForm.get('password').errors) {
      this.toastService.showToastAlert(this.getErrorMessage('Senha', this.loginForm.get('password').errors));
      return false;
    }
    return true;
  }

  /**
  * Retorna uma mensagem de erro sobre o formulário
  * @param {String} input Campo do formulario
  * @param {String} error Erro trazido do formulario
  * @return {String}
  */
  private getErrorMessage(input: string, error: any) {
    let errorMessage = "Campo '" + input + "' ";
    if (error.required) {
      return errorMessage + 'é obrigatório';
    }
    if (error.email) {
      return errorMessage + 'não é valido';
    }
  }

}
