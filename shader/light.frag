#version 330 core
out vec4 color;				//���һ��4�׾�����ɫ��ĳ��Ƭ�ε���ɫ
uniform vec3 objectColor;//uniform �ṹ�� ���ڱ�������б������ᱣ���������֣�Ȼ�����Ա�Ϳ�ͨ�����ֻ�ȡ���ڱ�������еĵ�ַ
void main()
{
	color =vec4(objectColor, 0.5f);  //RGB,���alpha
}//fragment shader ƬԪ��ɫ��