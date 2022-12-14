import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myForm!: FormGroup;
  pdfObj!: pdfMake.TCreatedPdf;
  photoPreview: string | undefined;
  logoData: string | ArrayBuffer | null = null;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(){
    this.myForm = this.fb.group({
      showLogo: true,
      from: 'Simon',
      to: 'Max',
      text: 'TEST'
    });

  }



  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.photoPreview = `data:image/jpeg;base64,${image.base64String}`;
  }

  createPdf() {
    const formvalue = this.myForm?.value;
    //const image = this.photoPreview ? { image: this.photoPreview, width: 300, alignment: 'center' } : {};

    let imageobjectplaceholder = { image: ""};

    if(this.photoPreview){
      imageobjectplaceholder =  {
          image: "this.photoPreview, width: 300, aligment: center"
      }
    };


    const docDefinition= {
      watermark: { text: 'Ionic Academy', color: 'blue', opacity: 0.2, bold: true },
          content: [
            {
              text: new Date().toTimeString()
            },
            { text: 'REMINDER', style: 'header' },
            {
              columns: [
                {
                  width: '50%',
                  text: 'From',
                  style: 'subheader'
                },
                {
                  width: '50%',
                  text: 'To',
                  style: 'subheader'
                }
              ]
            },
            {
              columns: [
                {
                  width: '50%',
                  text: formvalue.from
                },
                {
                  width: '50%',
                  text: formvalue.to
                }
              ]
            },
            imageobjectplaceholder,
            { text: formvalue.text},
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: 15
            },
            subheader: {
              fontSize: 14,
              bold: true,
              margin: 15
            }
          }
      };

    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  downloadPdf() {

      // On a browser simply use download!
      this.pdfObj.download();
  }

}
