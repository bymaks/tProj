<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        $this->view->registerJsFile('/js/qr-code/grid.js');
        $this->view->registerJsFile('/js/qr-code/version.js');
        $this->view->registerJsFile('/js/qr-code/detector.js');
        $this->view->registerJsFile('/js/qr-code/formatinf.js');
        $this->view->registerJsFile('/js/qr-code/errorlevel.js');
        $this->view->registerJsFile('/js/qr-code/bitmat.js');
        $this->view->registerJsFile('/js/qr-code/datablock.js');
        $this->view->registerJsFile('/js/qr-code/bmparser.js');
        $this->view->registerJsFile('/js/qr-code/datamask.js');
        $this->view->registerJsFile('/js/qr-code/rsdecoder.js');
        $this->view->registerJsFile('/js/qr-code/gf256poly.js');
        $this->view->registerJsFile('/js/qr-code/gf256.js');
        $this->view->registerJsFile('/js/qr-code/decoder.js');
        $this->view->registerJsFile('/js/qr-code/qrcode.js');
        $this->view->registerJsFile('/js/qr-code/findpat.js');
        $this->view->registerJsFile('/js/qr-code/alignpat.js');
        $this->view->registerJsFile('/js/qr-code/databr.js');


        $this->view->registerJsFile('/js/whammy.js');
        //$this->view->registerJsFile('/js/FileSave.js');
        $this->view->registerJsFile('/js/canvas.js');
        $this->view->registerJsFile('/js/camera.js');

        return $this->render('index');
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }
}
