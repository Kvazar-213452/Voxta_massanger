import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  await Hive.openBox<String>('messages');
  runApp(MyMessengerApp());
}

class MyMessengerApp extends StatefulWidget {
  @override
  _MyMessengerAppState createState() => _MyMessengerAppState();
}

class _MyMessengerAppState extends State<MyMessengerApp> {
  late IO.Socket socket;
  final TextEditingController _controller = TextEditingController();
  List<String> messages = [];

  @override
  void initState() {
    super.initState();
    _loadMessagesFromLocal();
    _connectToServer();
  }

  void _loadMessagesFromLocal() {
    var box = Hive.box<String>('messages');
    print("Завантажую повідомлення з Hive: ${box.values.toList()}");
    setState(() {
      messages = box.values.toList();
    });
  }

  void _saveMessageLocally(String message) async {
    var box = Hive.box<String>('messages');
    await box.add(message);
    print("Збережено повідомлення: $message");
  }

  void _connectToServer() {
    socket = IO.io('http://localhost:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((_) {
      print('Підключено до сервера');
    });

    socket.on('message', (data) {
      print("Отримано повідомлення від сервера: $data");
      setState(() {
        messages.add(data);
      });
      _saveMessageLocally(data);
    });

    socket.onDisconnect((_) {
      print('Відключено від сервера');
    });
  }

  void _sendMessage() {
    if (_controller.text.isNotEmpty) {
      socket.emit('message', _controller.text);
      _controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Мій Месенджер')),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  return ListTile(title: Text(messages[index]));
                },
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Введіть повідомлення',
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
