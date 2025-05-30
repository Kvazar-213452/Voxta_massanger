import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Відображення HTML',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const HtmlViewerScreen(),
    );
  }
}

class HtmlViewerScreen extends StatefulWidget {
  const HtmlViewerScreen({super.key});

  @override
  State<HtmlViewerScreen> createState() => _HtmlViewerScreenState();
}

class _HtmlViewerScreenState extends State<HtmlViewerScreen> {
  late InAppWebViewController webViewController;

  // Ваш HTML-код
  final String myHtml = """
<!DOCTYPE html>
<html>
<head>
    <title>Мій HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
        }
        h1 {
            color: #0066cc;
        }
    </style>
</head>
<body>
    <h1>Привіт з Flutter!</h1>
    <p>Це мій власний HTML-вміст.</p>
    <button onclick="showMessage()">Натисни мене</button>
    <script>
        function showMessage() {
            alert('Привіт з JavaScript!');
        }
    </script>
</body>
</html>
""";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Мій HTML'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => webViewController.reload(),
          ),
        ],
      ),
      body: InAppWebView(
        initialData: InAppWebViewInitialData(
          data: myHtml,
          mimeType: "text/html",
          encoding: "utf-8",
          baseUrl: WebUri("https://example.com"),
        ),
        onWebViewCreated: (controller) {
          webViewController = controller;
        },
        onConsoleMessage: (controller, consoleMessage) {
          print("Консоль: ${consoleMessage.message}");
        },
      ),
    );
  }
}